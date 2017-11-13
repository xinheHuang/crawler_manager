/**
 * Created by Xinhe on 2017-09-20.
 */
const {GRAPH_NODE_RELATION, GRAPH_NODE_INDICATOR, GRAPH_NODE, GRAPH, NODE_COMMENT, USER, IndicatorInfo} = require('../../../db')
const ApiError = require('../../../error/ApiError')
const ApiErrorNames = require('../../../error/ApiErrorNames')
const BusinessError = require('../../../error/BusinessError')
const GraphTypes = GRAPH.GraphTypes
const commonUtil = require('../../../utils/common')
const Converter = require('../../converter')

class GraphService {
    static async getGraphById(id) {
        const graph = await  GRAPH.findById(id, {
                                                include: {
                                                    model: GRAPH_NODE
                                                }
                                            }
        )
        if (!graph) {
            throw new BusinessError('graph不存在')
        }
        return Converter.GraphConverter(graph)
    }

    static async getNodeCommentsByNodeId(nodeId, pageNumber, pageSize,) {
        const comments = ( await NODE_COMMENT.findAll({
                                                          where: {
                                                              node_id: nodeId
                                                          },
                                                          include: {
                                                              model: USER
                                                          },
                                                          offset: (pageNumber - 1) * pageSize,
                                                          limit: (+pageSize) + 1,
                                                          order: [
                                                              ['time', 'DESC'],
                                                          ]
                                                      })) || []
        return {
            hasMore: comments.length > +pageSize,
            comments: comments.slice(0, +pageSize)
                              .map(Converter.NodeCommentConverter)
        }
    }

    static async addNodeComment(userId, nodeId, content) {
        const node = await GRAPH_NODE.findById(nodeId)
        if (!node) {
            throw new BusinessError('node不存在')
        }
        const comment = await node.createNODE_COMMENT(
            {
                user_id: userId,
                content,
                time: new Date().getTime(),
            }
        )
        comment.USER = await comment.getUSER()
        return Converter.NodeCommentConverter(comment)


    }


    static async searchIndicatorByKeyWord(key, pageNumber, pageSize,) {
        const {count, rows} = await IndicatorInfo.findAndCountAll({
                                                                      where: {
                                                                          name: {
                                                                              '$like': `%${key}%`
                                                                          }
                                                                      },
                                                                      offset: (pageNumber - 1) * pageSize,
                                                                      limit: +pageSize,
                                                                      order: [
                                                                          ['ID', 'ASC'],
                                                                      ]
                                                                  })
        return {
            total: Math.ceil(count / pageSize),
            indicators: rows
        }
    }

    static async getGraphNodeIndicators(id) {
        const graphNode = await GRAPH_NODE_RELATION.findById(id)
        if (!graphNode) {
            throw new BusinessError('graph node relation不存在')
        }
        return (await graphNode.getIndicator_infos()).map(({GRAPH_NODE_INDICATOR, name, ID}) => {
            const {id, upper_limit, warn_type, lower_limit} = GRAPH_NODE_INDICATOR
            return {
                indicatorId: ID,
                name,
                graphNodeIndicatorId: id,
                upper_limit,
                lower_limit,
                warn_type
            }
        })
    }

    static async addNodeIndicator(graphNodeId, indicatorId) {
        const graphNode = await GRAPH_NODE_RELATION.findById(graphNodeId)
        if (!graphNode) {
            throw new BusinessError('graph node relation不存在')
        }
        const [graphIndicators] = await graphNode.addIndicator_info(indicatorId, {
            through: {
                warn_type: 0,
                upper_limit: 0,
                lower_limit: 0,
            }
        })
        const graphIndicator = graphIndicators[0]
        const {name, ID} = await graphIndicator.getIndicator_info()
        const {upper_limit, warn_type, lower_limit, id} = graphIndicator
        return {
            indicatorId: ID,
            name,
            graphNodeIndicatorId: id,
            upper_limit,
            lower_limit,
            warn_type
        }
    }

    static async changeNodeIndicator(graphNodeIndicatorId, indicator) {
        await GRAPH_NODE_INDICATOR.update(indicator, {
            where: {
                id: graphNodeIndicatorId,
            }
        })
    }

    static async deleteNodeIndicator(graphNodeIndicatorId) {
        await GRAPH_NODE_INDICATOR.destroy({
                                               where: {
                                                   id: graphNodeIndicatorId
                                               }
                                           })
    }

    //user

    static async getGraphsByUserId(userId) {
        return (await GRAPH.findAll({
                                        where: {
                                            user_id: userId
                                        },
                                        include: {
                                            model: GRAPH_NODE
                                        }
                                    })).map((graph) => (Converter.GraphConverter(graph)))
    }

    static async getDraftGraphByUserIdAndEntity(userId, entity,) {
        let [graph, created] = await GRAPH.findOrCreate(
            {
                where: {
                    user_id: userId,
                    entity,
                    type: GraphTypes.DRAFT
                },
                include: {
                    model: GRAPH_NODE,
                },
                defaults: {
                    time: new Date().getTime(),
                    name: '草稿版本'
                }
            }
        )
        if (created) {
            graph = await graph
                .createGRAPH_NODE(
                    {
                        title: 'root',
                        node_id: commonUtil.uuid()
                    }, {
                        through: {
                            parent_node_id: 0,
                            direction: 'right'
                        }
                    })
                .then(() => GraphService.getGraphById(graph.graph_id))
        }
        else {
            graph = Converter.GraphConverter(graph)
        }
        return graph
    }

    static async postDraftGraph(userId, entity, nodes) {
        let [graph, created] = await GRAPH.findOrCreate(
            {
                where: {
                    user_id: userId,
                    entity,
                    type: GraphTypes.DRAFT
                },
                include: {
                    model: GRAPH_NODE,
                },
                defaults: {
                    time: new Date().getTime(),
                    name: '草稿版本'
                }
            }
        )

        //todo
        await Promise.all(nodes.map(({title, nodeId}) => GRAPH_NODE.upsert({title, node_id: nodeId}, {
            where: {
                node_id: nodeId
            }
        })))

        await Promise.all([
                              !created ? graph.update({
                                                          time: new Date().getTime(),
                                                      }) : null,
                              graph.setGRAPH_NODEs([])])
                     .then(() =>
                               Promise.all(nodes.map(({nodeId, parentNodeId, direction}) =>
                                                         graph.addGRAPH_NODE(nodeId, {
                                                             through: {
                                                                 parent_node_id: parentNodeId,
                                                                 direction
                                                             }
                                                         }))))


    }

    static async postFinalGraph(userId, name, entity, nodes) {
        const graph = await GRAPH.create({
                                             user_id: userId,
                                             name,
                                             entity,
                                             time: new Date().getTime(),
                                             type: GraphTypes.FINAL,
                                         })

        await Promise.all(nodes.reduce((prev, node) => {
            const {nodeId, parentNodeId, direction,title} = node
            return [
                ...prev,
                GRAPH_NODE.upsert({title, node_id: nodeId}, {
                    where: {
                        node_id: nodeId
                    }
                }),
                graph.addGRAPH_NODE(nodeId, {
                    through: {
                        parent_node_id: parentNodeId,
                        direction
                    }
                })
            ]
        }, []))

    }

}

module.exports = GraphService
