import Person from '../../types/Person.interface';

const fixPersonsList = (input: any): Person[] => {
  if (!Array.isArray(input)) return [];
  return input.map(entry => {
    const newEntry: Person = {
      id: '',
      name: '',
    };
    if ('id' in entry && typeof entry.id === 'string') {
      newEntry.id = entry.id;
    }
    if ('name' in entry && typeof entry.name === 'string') {
      newEntry.name = entry.name;
    }
    return newEntry;
  });
};

export default fixPersonsList;
