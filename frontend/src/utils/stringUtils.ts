export const parseModifications = (data: string): string => {
    const lines = data.split('\n').filter(Boolean);

    // Initialize variables for the HTML elements
    let formattedMarkup = '';
    let inUl = false;

    if (lines) {
        for (const line of lines) {
            if (line.startsWith('### ')) {
                // Extract the h3 content
                const h3 = line.substring(4);
                formattedMarkup += `<h3>${h3}</h3>`;
            } else if (line.startsWith(' - ')) {
                if (!inUl) {
                    formattedMarkup += `<ul>`;
                    inUl = true;
                }
                // Use a regular expression to match and extract the quoted parts
                const quotedParts = line.match(/`[^`]+`/g);
                if (quotedParts) {
                    // Replace the quoted parts with span tags
                    let listItem = line.substring(2);
                    for (const part of quotedParts) {
                        const textInsideQuotes = part.slice(1, -1);
                        listItem = listItem.replace(
                            part,
                            `<b>${textInsideQuotes}</b>`);
                    }
                    formattedMarkup += `<li>${listItem}</li>`
                } else {
                    formattedMarkup += `<li>${line.substring(2)}</li>`;
                }
            } else {
                if (inUl) {
                    formattedMarkup += `</ul>`
                    inUl = false;
                }
                // Extract the content for the <p> element
                const quotedPartsInP = line.match(/`[^`]+`/g);
                if (quotedPartsInP) {
                    let pContent = line;
                    for (const part of quotedPartsInP) {
                        const textInsideQuotes = part.slice(1, -1);
                        pContent = pContent.replace(
                            part,
                            `<b>${textInsideQuotes}</b>`
                        );
                    }
                    formattedMarkup += `<p>${pContent}</p>`;
                } else {
                    formattedMarkup += `<p>${line}</p>`;
                }
            }
        }
    }

    return formattedMarkup;
}
