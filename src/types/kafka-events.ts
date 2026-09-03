
type QuizUuid = string & { readonly __brand: unique symbol }
type QuizCreatorFirebaseUid = string & { readonly __brand: unique symbol }

type QuestionIndexing = {
    qI: number, //questionId, identificativo decimale, short, della domanda
    t: 0 | 1 | 2, //type: 0 vero-falso, 1 domanda aperta, oppure 2 domanda chiusa
    o: Array<number> //options: indici numerici delle possibili risposte
    a: Array<number> //answers: indici delle risposte effettive, un sottoinsieme di options
}

type CreatedQuizEvent = {
    quiz: [QuizCreatorFirebaseUid, QuizUuid],
    indexing: Array<QuestionIndexing>
}

export {
    CreatedQuizEvent,
}
