import { Page } from '@playwright/test';

export default class HotelPage{
    page: Page
    origin: string

    constructor(page: Page, origin: string){
        this.page = page
        this.origin = origin
    }
}