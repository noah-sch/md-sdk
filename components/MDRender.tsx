import React from "react";

import type { mdElements } from "../types/mdElements";

import mdElementParsing from "../utils/mdElementParsing";
import textBlockLineParsing from "../utils/textBlockLineParsing";
import inlineParsing from "../utils/inlineParsing";

type MDRenderProps = {
    markdown: string;
};


export default function MDRender({ markdown }: MDRenderProps) {
    const mdBlocks: mdElements = mdElementParsing(markdown);
    let elements: React.ReactNode[] = [];

    for (let block of mdBlocks) {
        if (block.type === 'code') {
            // Here : code block case -> 
            elements.push(
                <div className="flex flex-col items-start items-center bg-neutral-950 ">
                    <div>
                        {block.language}
                    </div>
                    {Object.entries(block)
                        .filter(([key]) => !isNaN(Number(key))) // garde uniquement les clés numériques
                        .map(([_, line], index) => (
                            <div key={index}>
                                {line}
                            </div>
                    ))}
                </div>
            )


        } else if (block.type === 'text') {
            // Here : text block case -> 
            for (let line of Object.values(block)) {
                const firstLineParsing = textBlockLineParsing(line);
                const parsedLineElements = inlineParsing(firstLineParsing[1]);
                
            }
        }
    }
    return(
        <>
            {elements}
        </>
    )
}