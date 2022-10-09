import { Connection, createConnection } from 'typeorm';
import request from "supertest";
import { app } from '../../../../app';

let connection: Connection;
let userToken: string;

describe("Show user profile", () => {
    beforeAll(async () => {
       connection = await createConnection();
       await connection.runMigrations();

       await request(app).post("/api/v1/users").send({
        name: "Bel",
        email: "bel@gmail.com",
        password: "1234"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
        email: "bel@gmail.com",
        password: "1234"
    });

    const { token } = responseToken.body;
    
    userToken = token;
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
      });

    it("should get an user profile", async () => {
        
        const response = await request(app)
        .get("/api/v1/profile")
        .set({
            Authorization: `Bearer ${userToken}`
        });

        expect(response.status).toBe(200);        
    });
})