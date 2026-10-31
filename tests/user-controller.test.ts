// tests/api.spec.ts
import {test, expect} from '@playwright/test';
import type {APIRequestContext} from '@playwright/test'

let baseURL: string = 'http://localhost:3000/users';

test.describe('User management API', () => {

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
    });

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
        expect(getUserResponseStatusCode).toBe(200)
    });

    test('find user: should return 404 if user not found', async ({ request }) => {
        const response = await request.get(`${baseURL}/101`);
        const responseBody = await response.json();
        const responseStatusCode = response.status()
        console.log('response status:', responseStatusCode)
        console.log('response body:', responseBody)
        expect(responseStatusCode).toBe(404)
    }); // always more than 100, id > 100

    test('create user: should add a new user', async ({ request }) => {
        const createUserResponse = await request.post(`${baseURL}`)
        const createUserResponseBody = await createUserResponse.json()
        const createUserResponseStatusCode = createUserResponse.status()
        console.log('Create user response status:', createUserResponseStatusCode)
        console.log('Create user response body:', createUserResponseBody)
        expect(createUserResponseStatusCode).toBe(201)
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
        expect(deleteUserResponseStatusCode).toBe(200)
    });

    test('delete user: should return 404 if user not found', async ({ request }) => {
        const deleteUserResponse = await request.delete(`${baseURL}/${101}`);
        const deleteUserResponseBody = await deleteUserResponse.json();
        const deleteUserResponseStatusCode = deleteUserResponse.status()
        console.log('DELETE user response status:', deleteUserResponseStatusCode)
        console.log('DELETE user response body:', deleteUserResponseBody)
        expect(deleteUserResponseStatusCode).toBe(404)
    });
});
