import { Content, Classification } from "./interface";

export async function loadDefaultContents() {
    const response = await fetch("api/accountBook", {
        // 파라미터 있을때 없을때 처리 여기서 필요없나?
    });
    const contents: Content[] = await response.json();
    return contents;
}
