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

    it("should authenticate an user", async () => {
        await request(app).post("/api/v1/users").send({
            name: "Bel",
	        email: "bel@gmail.com",
	        password: "1234"
        });

        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "bel@gmail.com",
	        password: "1234"
        });
        

        expect(responseToken.status).toBe(200);
        expect(responseToken.body).toHaveProperty("token");
    })
})