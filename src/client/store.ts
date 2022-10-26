import { Content, Classification, ContentDetail } from "./interface";

export async function loadContents(param?: string) {
    let url: string = param ? `api/accountBook/${param}` : "api/accountBook";
    const response = await fetch(url);
    const contents: ContentDetail[] = await response.json();
    return contents;
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

export async function loadAllClassifications() {
    const response = await fetch("api/classification");
    const classifications: Classification[] = await response.json();
    return classifications;
}


