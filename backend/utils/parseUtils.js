import _ from 'lodash'

const shortEval = (evaluation) => {
    const filledAt = Date.parse(evaluation.filled_at)
    const beginAt = Date.parse(evaluation.begin_at)
    return ((filledAt - beginAt) / 1000 / 60) < 15
}

const shortFeedback = evaluation => evaluation.comment.length < 100

const lowRating = evaluation => {
    // most of the feedbacks are an array within scale_team, some are formatted differently, TODO: look into it
    if (evaluation.feedbacks[0]) {
        return (evaluation.feedbacks[0].rating <= 3)
    }
}

export const parseEvaluations = (evaluationList) => {
    return {
        shortEvaluations: _.filter(evaluationList, evaluation => shortEval(evaluation)),
        shortFeedbackEvaluations: _.filter(evaluationList, evaluation => shortFeedback(evaluation)),
        lowRatingEvaluations:  _.filter(evaluationList, evaluation => lowRating(evaluation))
    }
}

export const applyGoodnessScale = (evaluationList) => {
    return evaluationList.map(evaluation => {
        let goodness = shortEval(evaluation) ? 2/3 : 1;
        goodness = shortFeedback(evaluation) ? goodness - 1/3 : goodness;
        goodness = lowRating(evaluation) ? goodness - 1/3 : goodness;
        return {
            ...evaluation,
            evalGoodness: goodness.toFixed(2)
        }
    })
}

export const goodnessCount = (evaluationList) => {
    return _.countBy(evaluationList, 'evalGoodness')
}

export const paginateItems = (items, page = 1, per_page = 30) => {
    const offset = (page - 1) * per_page
    const pagedItems = _.drop(items, offset).slice(0, per_page)
    return {
        page: page,
        per_page: per_page,
        last_page: Math.ceil(items.length / per_page),
        total: items.length,
        data: pagedItems
    }
}