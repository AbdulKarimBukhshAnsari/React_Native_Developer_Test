import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../config/redux/store';
export const useAppDispatch = () => useDispatch<AppDispatch>();
