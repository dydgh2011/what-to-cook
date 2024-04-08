import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import axios from 'axios';
import * as urlParse from 'url-parse';

@Injectable()
export class SearchService {
  private openai: OpenAI;
  private g_key: string;
  private g_id: string;
  private baseUrl = 'https://customsearch.googleapis.com/customsearch/v1';
  // const parsedUrl = new URL(url);
  // return parsedUrl.hostname;
  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    this.g_key = this.configService.get<string>('GOOGLE_SEARCH_API_KEY');
    this.g_id = this.configService.get<string>('GOOGLE_SEARCH_ENGINE_ID');
  }

  async search(ingredients: string) {
    //check user's location (country);
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `
          You will get the list of food ingredients or just name of the food and your task is to provide the name of the dish that user can cook with the given food ingredients.
          if there is non food or food ingredients in the given list, you have to reply with "ERROR".
          if there is no dish that user can make with the given food ingredients, you have to reply with "ERROR".
          name of the food and food ingredients can be in multiple languages.
          you must use using Korean language to name the dish.
          you can ignore some of the ingredients if you think it is not necessary.
          you must reply with only one dish name or ERROR.
          don't add any extra explanations.
          `,
        },
        {
          role: 'assistant',
          content: `
                Example: 
                User: salt, 후추, egg
                AI: 계란프라이
          `,
        },
        {
          role: 'assistant',
          content: `
                Example: 
                User: samsung phone, onion, garlic
                AI: ERROR
          `,
        },
        {
          role: 'assistant',
          content: `
                Example: 
                User: salt 후추 egg
                AI: 계란프라이
          `,
        },
        {
          role: 'assistant',
          content: `
                Example: 
                User: 오늘 날씨가 어떄?
                AI: ERROR
          `,
        },
        {
          role: 'assistant',
          content: `
                Example: 
                User: 라면 국물, 계란, 돼지고기, 파, 당근, 오랜지
                AI: 라면국물 계란찜
          `,
        },
        { role: 'user', content: ingredients },
      ],
      model: 'gpt-4',
      n: 1,
    });
    let [content] = completion.choices.map((choice) => choice.message.content);

    //check if the ai returns error
    if (content.includes('ERROR')) {
      //return user a error message (wrong input)
      return {
        result: 'ERROR',
        datas: [],
      };
    }

    content = content.replaceAll(' ', '+');
    content = content.replaceAll('.', '');
    content = content.replaceAll(',', '');

    const datas = await this.searchRecipe(content);

    content = content.replaceAll('+', ' ');
    return {
      result: content,
      datas: datas,
    };
  }

  async searchRecipe(dishName: string) {
    try {
      const datas = [];
      const url = `${this.baseUrl}?key=${this.g_key}&cx=${this.g_id}&q=${dishName}+레시피&gl=${'ko'}&hl=${'ko'}`;

      const response = await axios.get(url);
      if (response.data) {
        if (response.data.items) {
          const items = response.data.items;
          for (const item of items) {
            // trim the url
            if (item.link) {
              let iconURL = urlParse(item.link).hostname;

              const iconLink = urlParse(item.link).hostname.split('.');
              if (iconLink.length > 1) {
                const lastTwo = iconLink.slice(-2).join('.');
                iconURL = `www.${lastTwo}`;
              }

              const data = {
                webName: item.displayLink || null,
                title: item.title || null,
                link: item.link || null,
                thumbnail:
                  (item.pagemap &&
                    item.pagemap.cse_thumbnail &&
                    item.pagemap.cse_thumbnail[0] &&
                    item.pagemap.cse_thumbnail[0].src) ||
                  null,
                favicon:
                  (iconURL &&
                    `https://www.google.com/s2/favicons?domain=${iconURL}&sz=256`) ||
                  null,
              };
              datas.push(data);
            }
          }
        }
      }

      return datas;
    } catch (error) {
      console.error('Error while fetching search results:', error);
      throw new Error('Error while fetching search results');
    }
  }

  generateDummyData() {
    const datas = [];

    for (let i = 0; i < 10; i++) {
      const src =
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6eOSD1h2IBs6m7FsD1_lntQSIgZEEcrHxTmwV6wWFoACeRSbUfOXYxiKs&s';
      const data = {
        webName: 'www.10000recipe.com',
        title: '식당에서 먹던 맛과 비주얼 그대로, 폭탄 계란찜 만드는 법',
        link: 'https://www.10000recipe.com/recipe/6872350',
        thumbnail: src,
        favicon: `https://www.google.com/s2/favicons?domain=www.10000recipe.com&sz=256`,
      };
      datas.push(data);
    }
    return datas;
  }
}
