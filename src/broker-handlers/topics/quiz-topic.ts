import { saveQuiz } from "../../temporarly-database/quizzes-cache.js"
import { CreatedQuizEvent } from "../../types/kafka-events.js"
import { ParsedCreatedQuizEventPayload } from "../../types/quizzes-storage.js"

const parseQuestionsIndexing: (indexing: CreatedQuizEvent['indexing']) => ParsedCreatedQuizEventPayload['questions'] = (indexing) => {

    const parsed: ParsedCreatedQuizEventPayload['questions'] = []

    for (const { qI, a: answers, o: options, t: type } of indexing) {
        const obj: { type: number, options?: Array<number>, answers?: Array<number> } = { type }
        if (type === 0) {
            obj.answers = answers
        }
        else if (type === 2) {
            obj.options = options
            obj.answers = answers
        }
        parsed.push(qI, JSON.stringify(obj))
    }

    return parsed
}

const onCreateQuizEvent = ({ quiz, indexing }: CreatedQuizEvent) => {
    saveQuiz({ quiz, questions: parseQuestionsIndexing(indexing) })
}

export default ({
    onCreateQuizEvent
})
