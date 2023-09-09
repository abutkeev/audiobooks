import { v4 } from 'uuid';

const generateID = () => v4().toUpperCase();

export default generateID;
