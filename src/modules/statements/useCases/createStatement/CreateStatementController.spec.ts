import { Connection, createConnection } from 'typeorm';
import request from "supertest";
import { app } from '../../../../app';

let connection: Connection;
let userToken: string;

describe("Create a statement", () => {
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

    it("should be able to make a deposit", async () => {
        
        const response = await request(app)
        .post("/api/v1/statements/deposit")
        .send({
                amount: 100,
                description: "pix"
              }
        )
        .set({
            Authorization: `Bearer ${userToken}`
        });

        //console.log(response.body);

        expect(response.status).toBe(201);    
        expect(response.body).toHaveProperty("created_at");
        expect(response.body).toHaveProperty("id");  
    });

    it("should be able to make a withdraw", async () => {
        
        const response = await request(app)
        .post("/api/v1/statements/withdraw")
        .send({
                amount: 50,
                description: "pix"
              }
        )
        .set({
            Authorization: `Bearer ${userToken}`
        });

        //console.log(response.body);

        expect(response.status).toBe(201);    
        expect(response.body).toHaveProperty("created_at");
        expect(response.body).toHaveProperty("id");  
    });

    it("should not be able to make a withdraw without fund", async () => {
        
        const response = await request(app)
        .post("/api/v1/statements/withdraw")
        .send({
                amount: 150,
                description: "pix"
              }
        )
        .set({
            Authorization: `Bearer ${userToken}`
        });

        expect(response.status).toBe(400);
    });
})