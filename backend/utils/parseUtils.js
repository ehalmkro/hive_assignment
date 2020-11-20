import _ from 'lodash'

const shortEvaluations = (evaluationList) => _.filter(evaluationList, evaluation => {
    const filledAt = Date.parse(evaluation.filled_at)
    const beginAt = Date.parse(evaluation.begin_at)
    return ((filledAt - beginAt) / 1000 / 60) < 15
})

const shortFeedbackEvaluations = (evaluationList) => _.filter(evaluationList, evaluation => evaluation.comment.length < 100)

const lowRatingEvaluations = (evaluationList) => _.filter(evaluationList, evaluation => {
    // most of the feedbacks are an array within scale_team, some are formatted differently, TODO: look into it
    if (evaluation.feedbacks[0]) {
        return (evaluation.feedbacks[0].rating <= 3)
    }
})

const parseEvaluations = (evaluationList) => {
    return {
        shortEvaluations: shortEvaluations(evaluationList),
        shortFeedbackEvaluations: shortFeedbackEvaluations(evaluationList),
        lowRatingEvaluations: lowRatingEvaluations(evaluationList)
    }
}


export default {parseEvaluations}