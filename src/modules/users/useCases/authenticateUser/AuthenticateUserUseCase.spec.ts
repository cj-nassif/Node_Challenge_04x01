import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";


let inMemoryUserRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
describe("Authenticate User", () => {

    beforeEach(async () => {
        inMemoryUserRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);

        const user = {
            name: "VanessaAndrade",
	        email: "vanessandrade@gmail.com",
            password: "1234"
        }

        await createUserUseCase.execute({
            name: user.name,
	        email: user.email,
            password: user.password
        })
    })

    it("should verify password match", async () => {
      const authenticate = await authenticateUserUseCase.execute({
        email: "vanessandrade@gmail.com",
        password: "1234"
      })

     // console.log(authenticate);

      expect(authenticate).toHaveProperty("token");
      expect(authenticate).toHaveProperty("user");
      expect(authenticate.user.name).toEqual("VanessaAndrade");

    })

    it("should verify user exists", async () => {
        expect(async () => {
            const authenticate = await authenticateUserUseCase.execute({
                email: "vanessandrade21@gmail.com",
                password: "1234"
              })
        }).rejects.toBeInstanceOf(AppError)
  
      })
})