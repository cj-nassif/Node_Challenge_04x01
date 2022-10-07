import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";



let inMemoryUserRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
describe("Authenticate User", () => {

    beforeEach(async () => {
        inMemoryUserRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserRepository);
    })

    it("should get a user profile", async () => {

        const user = {
            name: "VanessaAndrade",
	        email: "vanessandrade@gmail.com",
            password: "1234"
        }

        const userCreated = await createUserUseCase.execute({
            name: user.name,
	        email: user.email,
            password: user.password
        })

      const userProfile = await showUserProfileUseCase.execute(userCreated.id!);

      expect(userProfile).toHaveProperty("id");

    })
})