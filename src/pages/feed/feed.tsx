import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import {
  fetchFeeds,
  selectIsLoading,
  selectOrders
} from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const isFeedLoading = useSelector(selectIsLoading);

  const orders: TOrder[] = useSelector(selectOrders);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (isFeedLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
