import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })  
    it("should be able to create a new user", async () => {
        const user = {
            name: "Vanessa",
	        email: "vanessa@gmail.com",
            password: "1234"
        }

        const userCreated = await createUserUseCase.execute({
            name: user.name,
	        email: user.email,
            password: user.password
        })

        expect(userCreated).toHaveProperty("id");
    })

    it("should not be able to create a new user with email already exists", async () => {
       expect(async () => {
        const user = {
            name: "Vanessa",
	        email: "vanessa@gmail.com",
            password: "1234"
        }

        const userCreated = await createUserUseCase.execute({
            name: user.name,
	        email: user.email,
            password: user.password
        })

        const userCreatedSecond = await createUserUseCase.execute({
            name: "Maria",
	        email: user.email,
            password: "4321"
        })
       }).rejects.toBeInstanceOf(AppError)
    })
})