import MovableItem from '../MovableItem/MovableItem';
import { Container, Total } from './MovableItemListStyles';

const MovableItemList = ({
  ID,
  listTitle,
  total,
  removeOrder,
  moveForward,
  moveBackward,
  items,
}) => {
  return (
    <Container>
      <h4 className="roboto-thin mb-5">
        {listTitle} <Total>{total}</Total>
      </h4>
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
