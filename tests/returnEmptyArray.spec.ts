import {test, expect} from '@playwright/test';
import type {APIRequestContext} from '@playwright/test'
import { StatusCodes } from 'http-status-codes'

let baseURL: string = 'http://localhost:3000/users';

test.describe('Empty array', () => {

    const cleanupUsers = async (request: APIRequestContext): Promise<void> => {
        const response = await request.get(`${baseURL}`);
        const users: Array<any> = await response.json();

        let i = 0;
        for (i; i < users.length; i = i + 1) {
            await request.delete(`${baseURL}/${users[i].id}`)
        }
        console.log(`Removed: ${i} users`);
    }

    test('all users: should return empty array when no users', async ({ request }) => {
        await cleanupUsers(request);
        const responseAfterCleanup = await request.get(`${baseURL}`);
        const usersAfterCleanUp = await responseAfterCleanup.json();
        expect(usersAfterCleanUp.length).toBe(0);
    })
});