import { GET_ME_USECASE, GetMeUseCase } from "../../application/get-me";

export const getMeProvider = {
  provide: GET_ME_USECASE,
  useClass: GetMeUseCase
}