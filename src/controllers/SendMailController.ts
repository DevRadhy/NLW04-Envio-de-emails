import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../../repositories/SurveysUsersRepository";
import { UserRepository } from "../../repositories/UserResitory";

import SendMailService from "../services/SendMailService";

import { AppError } from "../errors/AppError";

import path from 'path';

export class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const userRepository = getCustomRepository(UserRepository);
    const surveyRepository = getCustomRepository(SurveysRepository);
    const surveysUserRepository = getCustomRepository(SurveysUsersRepository);

    const user = await userRepository.findOne({ email });

    if (!user) {
      throw new AppError("User does not exists!");
    }

    const survey = await surveyRepository.findOne({ id: survey_id });

    if (!survey) {
      throw new AppError("Survey does not exists!");
    }
    
    const npsPath = path.resolve(__dirname, "..", "views","emails", "npsMail.hbs");
    
    const surveyUserAlreadyExists = await surveysUserRepository.findOne({
      where: { user_id: user.id, value: null },
      relations:[ "user", "survey" ],
    });

    const mailProps = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: "",
      link: String(process.env.URL_MAIL),
    }

    if (surveyUserAlreadyExists) {
      mailProps.id = surveyUserAlreadyExists.id;

      await SendMailService.execute(email, survey.title, mailProps, npsPath);

      return response.json(surveyUserAlreadyExists);
    }

    const surveyUser = surveysUserRepository.create({
      user_id: user.id,
      survey_id
    })

    await surveysUserRepository.save(surveyUser);

    mailProps.id = surveyUser.id;

    await SendMailService.execute(email, survey.title, mailProps, npsPath);

    return response.json(surveyUser);
  }
}