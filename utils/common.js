/**
 * Created by Xinhe on 2017/10/15.
 */
exports.uuid = () => (new Date().getTime()
                                .toString(16) + Math.random()
                                                    .toString(16)
                                                    .substr(2)).substr(2, 16)