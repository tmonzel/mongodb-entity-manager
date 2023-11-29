export type Person = {
  firstName: string;
  lastName: string;
  address: {
    street: string;
    postalCode: string;
  };
  
  projects: Project[];
}

export type Project = {
  name: string;
}
