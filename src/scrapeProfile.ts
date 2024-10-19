// import fs from 'fs';
// import path from 'path';
import { JSDOM } from 'jsdom';

export const scrapeProfile = (html: string): string => {
    // Parse the HTML string using jsdom
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Extract each content
    const preference = document.querySelector('.group-card_title')?.textContent?.trim() || '';
    const commonality = document.querySelector('.profile-affinity')?.textContent?.trim() || '';
    const favorite = {
    title: document.querySelector('.konomi-comment_name')?.textContent?.trim() || '',
    description: document.querySelector('.konomi-comment_text')?.textContent?.trim() || ''
    };
    const introduction = document.querySelector('.profile-introduction_content')?.textContent?.trim() || '';

    // Output the extracted contents
    return (
    `Preference:${preference}
    Commonality: ${commonality}
    Favorite: ${favorite}
    Introduction: ${introduction}`
    )
}

// const html: string = fs.readFileSync(path.resolve(__dirname, "../html/profile2.html"), 'utf8')
// scrapeProfile(html);