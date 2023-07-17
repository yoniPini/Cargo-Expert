from enum import Enum


class Rotation(Enum):
    """
    Each letter stands for a box axis - W = width, H = height, L = length.
    """
    WHL = 0
    LHW = 1
    HLW = 2
    LWH = 3
    WLH = 4
    HWL = 5


class Box:
    def __init__(self, id, order, box_type, width, height, length, color, isIn, center=[0, 0, 0]):

        # The algorithm works with integers only.
        width, height, length = int(width), int(height), int(length)

        self.id = int(id)
        self.order = int(order)
        self.box_type = box_type
        self.size = width, height, length
        self.volume = width * height * length
        self.rotation = Rotation.WHL
        self.color = color
        self.isIn = int(isIn)

        self.center = [float(axis) for axis in center]
        # TODO: what happens if FLB is float?
        self.FLB = (self.center[0] - self.get_size()[0]/2,
                    self.center[1] - self.get_size()[1]/2,
                    self.center[2] - self.get_size()[2]/2)

    def get_size(self) -> tuple[int, int, int] | Exception:
        """
        Returns size considering the rotation. 
        """
        match self.rotation:
            case Rotation.WHL:
                return self.size
            case Rotation.LHW:
                return self.size[2], self.size[1], self.size[0]
            case Rotation.HLW:
                return self.size[1], self.size[2], self.size[0]
            case Rotation.LWH:
                return self.size[2], self.size[0], self.size[1]
            case Rotation.WLH:
                return self.size[0], self.size[2], self.size[1]
            case Rotation.HWL:
                return self.size[1], self.size[0], self.size[2]
            case __:
                raise Exception("Error: Box.get_size: no rotation was found")

    def set_position(self, p: tuple[int, int, int]):
        """
        Sets the position of the box given its FLB point.
        """
        self.FLB = p
        self.center = p[0] + self.get_size()[0]/2, p[1] + \
            self.get_size()[1]/2, p[2] + self.get_size()[2]/2
        self.isIn = 1

    def __repr__(self) -> str:
        initial = f'"id": {self.id.__str__()}, "order": {self.order.__str__()}, "size": {list(self.get_size()).__str__()},"position": {list(self.center).__str__()}, "color": \"{self.color}\","type": \"{self.box_type}\","isIn": \"{self.isIn.__str__()}\"'
        return '{' + initial + '}'
