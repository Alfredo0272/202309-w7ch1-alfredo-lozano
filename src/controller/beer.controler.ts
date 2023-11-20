/* eslint-disable no-negated-condition */
import { Request, Response } from 'express';
import { ObjectEncodingOptions } from 'fs';
import fs from 'fs/promises';
import { Beer } from '../model/beer.model';

const fileName = './data/data.json';
const codeOptions: ObjectEncodingOptions = {
  encoding: 'utf-8',
};

export const readDataFile = async () => {
  try {
    const rawData = (await fs.readFile(fileName, codeOptions)) as string;
    return JSON.parse(rawData).beer as Beer[];
  } catch (error) {
    console.log((error as Error).message);
  }
};

const writeDataFile = async (beer: Beer[]) => {
  try {
    const data = { beer };
    await fs.writeFile(fileName, JSON.stringify(data), codeOptions);
  } catch (error) {
    console.log((error as Error).message);
  }
};

export const getAll = async (_req: Request, res: Response) => {
  const jsonData = await readDataFile();
  res.json(jsonData);
};

export const getById = async (req: Request, res: Response) => {
  const jsonData = (await readDataFile()) as Beer[];
  const result = jsonData.find(
    (item: { id: number }) => item.id === Number(req.params.id)
  );
  res.json(result);
};

export const create = async (req: Request, res: Response) => {
  const jsonData = (await readDataFile()) as Beer[];
  const maxId = Math.max(...jsonData.map((beer) => beer.id), 0);
  const newBeer = { ...req.body, id: maxId + 1 };
  jsonData.push(newBeer);
  await writeDataFile(jsonData);
  res.json(newBeer);
};

export const update = async (req: Request, res: Response) => {
  try {
    const jsonData = (await readDataFile()) as Beer[];
    const index = jsonData.findIndex(
      (item: { id: number }) => item.id === Number(req.params.id)
    );

    if (index !== -1) {
      const updatedBeer = { ...jsonData[index], ...req.body };
      jsonData[index] = updatedBeer;
      await writeDataFile(jsonData);
      res.json(updatedBeer);
    } else {
      res.status(404).json({ error: 'Beer not found' });
    }
  } catch (error) {
    console.log((error as Error).message);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const jsonData = (await readDataFile()) as Beer[];
    const index = jsonData.findIndex(
      (item: { id: number }) => item.id === Number(req.params.id)
    );

    if (index !== -1) {
      jsonData.splice(index, 1);
      await writeDataFile(jsonData);
      res.json({});
    } else {
      res.status(404).json({ error: 'Beer not found' });
    }
  } catch (error) {
    console.log((error as Error).message);
  }
};
