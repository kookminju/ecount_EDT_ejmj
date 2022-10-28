import { Content, Classification, ContentDetail, Record } from "./interface";


export async function getMonthlyContents(params?: string) {
    const contents: ContentDetail[] = await loadContents(params);
    return contents;
}

export async function getContentById(contentId: string) {
    const content: ContentDetail = await loadContentById(contentId);
    return content;
}

export async function getMonthlyRecords(param?: string) {
    const records: Record[] = await loadRecords(param);
    return records;
}

export async function getAllClassifications() {
    const classifications: Classification[] = await loadAllClassifications()
    return classifications;
}

export async function getClassificationsByCategory(category: string) {
    const classifications: Classification[] = await loadClassificationsByCategory(category);
    return classifications;
}

// export 빼기
export async function loadContents(param?: string) {
    let url: string = "api/accountBook";
    if(param) { url += `/${param}`} 

    const response = await fetch(url);
    const contents: ContentDetail[] = await response.json();
    return contents;
}

// export 빼기
export async function loadContentById(contentId: string) {
    const response = await fetch("api/contentDetail/" + contentId);
    const content: ContentDetail = await response.json();
    return content;
}

export async function addAccountBookContent(param: Content) {
    const response = await fetch("api/accountBook", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "content": param }),
    });
    return response.status;
}

export async function modifyAccountBookContent(param: Content) {
    const response = await fetch("api/accountBook/" + param.contentId , {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "content": param }),
    });
    return response.status;
}

export async function removeAccountBookContent(contentId: string) {
    const response = await fetch("api/accountBook/" + contentId , {
        method: "DELETE",
    });
    return response.status;
}

// export 빼기
export async function loadAllClassifications() {
    const response = await fetch("api/classification");
    const classifications: Classification[] = await response.json();
    return classifications;
}

// export 빼기
export async function loadClassificationsByCategory(category: string) {
    const response = await fetch("api/classification/category/" + category);
    const classifications: Classification[] = await response.json();
    return classifications;
}

async function loadRecords(param?: string) {
    let url: string = "api/report";
    if(param) { url += `/${param}`} 

    const response = await fetch(url);
    const records: Record[] = await response.json();
    return records;
}
