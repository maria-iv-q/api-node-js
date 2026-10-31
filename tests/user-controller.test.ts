// tests/api.spec.ts
import {test, expect} from '@playwright/test';
import type {APIRequestContext} from '@playwright/test'
import { StatusCodes } from 'http-status-codes'

let baseURL: string = 'http://localhost:3000/users';

test.describe('User management API', () => {

    test('find user: should return a user by ID', async ({ request }) => {
      //Create a new user
        const createUserResponse = await request.post(`${baseURL}`)
        const createUserResponseBody = await createUserResponse.json()
        const id = createUserResponseBody.id

        //GET the user
        const getUserResponse = await request.get(`${baseURL}/${id}`);
        const getUserResponseBody = await getUserResponse.json();
        const getUserResponseStatusCode = getUserResponse.status()
        console.log('GET user response status:', getUserResponseStatusCode)
        console.log('GET user response body:', getUserResponseBody)
        expect(getUserResponseStatusCode).toBe(StatusCodes.OK)
    });

    test('find user: should return 404 if user not found', async ({ request }) => {
        const response = await request.get(`${baseURL}/101`);
        const responseBody = await response.json();
        const responseStatusCode = response.status()
        console.log('response status:', responseStatusCode)
        console.log('response body:', responseBody)
        expect(responseStatusCode).toBe(StatusCodes.NOT_FOUND)
    }); // always more than 100, id > 100

    test('create user: should add a new user', async ({ request }) => {
        const createUserResponse = await request.post(`${baseURL}`)
        const createUserResponseBody = await createUserResponse.json()
        const createUserResponseStatusCode = createUserResponse.status()
        console.log('Create user response status:', createUserResponseStatusCode)
        console.log('Create user response body:', createUserResponseBody)
        expect(createUserResponseStatusCode).toBe(StatusCodes.CREATED)
    });

    test('delete user: should delete a user by ID', async ({ request }) => {
        //Create a new user
        const createUserResponse = await request.post(`${baseURL}`)
        const createUserResponseBody = await createUserResponse.json()
        const id = createUserResponseBody.id

        //DELETE the user
        const deleteUserResponse = await request.delete(`${baseURL}/${id}`);
        const deleteUserResponseBody = await deleteUserResponse.json();
        const deleteUserResponseStatusCode = deleteUserResponse.status()
        console.log('DELETE user response status:', deleteUserResponseStatusCode)
        console.log('DELETE user response body:', deleteUserResponseBody)
        expect(deleteUserResponseStatusCode).toBe(StatusCodes.OK)
    });

    test('delete user: should return 404 if user not found', async ({ request }) => {
        const deleteUserResponse = await request.delete(`${baseURL}/${101}`);
        const deleteUserResponseBody = await deleteUserResponse.json();
        const deleteUserResponseStatusCode = deleteUserResponse.status()
        console.log('DELETE user response status:', deleteUserResponseStatusCode)
        console.log('DELETE user response body:', deleteUserResponseBody)
        expect(deleteUserResponseStatusCode).toBe(StatusCodes.NOT_FOUND)
    });
});
