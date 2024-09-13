import MovableItem from '../MovableItem/MovableItem';
import { Container } from './MovableItemListStyles';

const MovableItemList = ({
  ID,
  listTitle,
  removeOrder,
  moveForward,
  moveBackward,
  items,
}) => {
  return (
    <Container>
      <h4 className="roboto-thin mb-5">{listTitle}</h4>
      {items.length > 0
        ? items.map((item) => {
            return (
              <MovableItem
                order={item}
                removeOrder={removeOrder}
                moveForward={moveForward}
                moveBackward={moveBackward}
              />
            );
          })
        : ''}
    </Container>
  );
};

export default MovableItemList;
