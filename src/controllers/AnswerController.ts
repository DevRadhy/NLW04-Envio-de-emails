import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../../repositories/SurveysUsersRepository";
import { AppError } from "../errors/AppError";

export class AnswerController {
  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { user } = request.query;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(user)
    });

    if (!surveyUser) {
      throw new AppError("Survey Users does not exists!");
    }

    surveyUser.value = Number(value);

    await surveysUsersRepository.save(surveyUser);

    return response.json(surveyUser);
  }
}