import { Connection, createConnection } from 'typeorm';
import request from "supertest";
import { app } from '../../../../app';

let connection: Connection;

describe("Create user controller", () => {
    beforeAll(async () => {
       connection = await createConnection();
       await connection.runMigrations();
       
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
      });

    it("should create a new user", async () => {
        const responseUser = await request(app).post("/api/v1/users").send({
            name: "Bel",
	        email: "bel@gmail.com",
	        password: "1234"
        });

        expect(responseUser.status).toBe(201);
    })

    it("should not to be able to create a new user with existent email", async () => {
        const responseUser = await request(app).post("/api/v1/users").send({
            name: "Bel",
	        email: "bel@gmail.com",
	        password: "1234"
        });

        expect(responseUser.status).toBe(400);
    })
})