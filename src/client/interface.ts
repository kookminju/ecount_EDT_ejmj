export interface Content {
    contentId: string;
    classificationId: number;
    contentDate: string;
    memo: string;
    amount: number;
}

export interface Classification {
    classificationId: number;
    category: 'I' | 'O';
    mainType: string;
    subType: string;
}

export interface ContentDetail extends Content, Classification {
    // 이렇게 해도 되나?
}