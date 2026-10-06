import { saveQuiz, updateQuiz } from "../../temporarly-database/quizzes-cache.js"
import { CreatedQuizEvent, QuizNewVersionAvailableEvent } from "../../types/kafka-events.js"
import { ParsedCreatedQuizEventPayload, QuestionContent } from "../../types/quizzes-storage.js"

const parseQuestionsIndexing = (
    indexing: CreatedQuizEvent['indexing']
): ParsedCreatedQuizEventPayload['questions'] => {

    const parsed: ParsedCreatedQuizEventPayload['questions'] = {}

    for (const { qI, a: answers, o: options, t: type } of indexing) {
        const obj: QuestionContent = { type, options: null, answers: null }

        if (type === 0) {
            obj.answers = answers || null
        }
        else if (type === 2) {
            obj.options = options || null
            obj.answers = answers || null
        }

        parsed[qI] = obj
    }

    return parsed
}

const onCreateQuizEvent = ({ quiz, indexing }: CreatedQuizEvent) => {
    saveQuiz({ quiz, questions: parseQuestionsIndexing(indexing) })
}

const onNewQuizVersionAvailableEvent = ({ quizId, releaseNumber, addedQuestions }: QuizNewVersionAvailableEvent) => {
    updateQuiz({ quizId, releaseNumber, addedQuestions })
}

export default ({
    onCreateQuizEvent,
    onNewQuizVersionAvailableEvent
})
