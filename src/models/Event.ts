import { User } from "./User";

interface EventFields {
  readonly id: string;
  title: string;
  description: string;
  date: Date;
  studsYear: number;
  pictures: string[];
  frontPicture: string;
  published: boolean;
  eventDate: Date;
}

export interface Event extends EventFields {
  author: string;
}

export interface CreateEvent extends EventFields {
  author: string;
}
