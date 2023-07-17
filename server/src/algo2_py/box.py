from box_motion import Rotation

'''
class Point:
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z

    def to_list(self):
        return [self.x, self.y, self.z]

class Size:
    def __init__(self, width, height, length):
        self.width = width
        self.height = height
        self.length = length

    def to_list(self):
        return [self.width, self.height, self.length]
'''


class Box:
    def __init__(self, box):
        self.width = box['width']
        self.height = box['height']
        self.length = box['length']
        self.volume = self.width * self.height * self.length
        self.rotation = Rotation.WHL
        self.center = (0, 0, 0) # Point(0, 0, 0)
        self.FLB = (0, 0, 0) # Point(0, 0, 0)
        self.isIn = 0
        self.id = box['id']
        self.order = box['order']
        self.color = box['color']
        self.type = box['type']

    def get_size(self):
        """
        Returns size considering the rotation. 
        """
        match self.rotation:
            case Rotation.WHL:
                return (self.width, self.height, self.length)
            case Rotation.LHW:
                return (self.length, self.height, self.width)
            case Rotation.HLW:
                return (self.height, self.length, self.width)
            case Rotation.LWH:
                return (self.length, self.width, self.height)
            case Rotation.WLH:
                 return (self.width, self.length, self.height)
            case Rotation.HWL:
                return (self.height, self.width, self.length)
            case __:
                raise Exception("Error: Box.get_size: no rotation was found")


    def set_position(self, p):
        box_size = self.get_size()

        if p[3] == 1:
            self.FLB = (p[0], p[1], p[2]) # Point(p[0], p[1], p[2])
        else:
            self.FLB = (p[0] - box_size[0], p[1], p[2]) # Point(p[0] - box_size.width, p[1], p[2])

        self.center = (
            self.FLB[0] + box_size[0] / 2,
            self.FLB[1] + box_size[1] / 2,
            self.FLB[2] + box_size[2] / 2
            )
        

        # self.center = Point(
        #     self.FLB.x + box_size.width / 2,
        #     self.FLB.y + box_size.height / 2,
        #     self.FLB.z + box_size.length / 2
        # )
        self.isIn = 1

    def unset_position(self):
        self.FLB = (0, 0, 0) # Point(0, 0, 0)
        self.center = (0, 0, 0)# Point(0, 0, 0)
        self.isIn = 0

    #TODO: change usage of "get_box_object" to "get_box"
    def get_box_object(self):
        return {
            "id": self.id,
            "order": self.order,
            "size": self.get_size().to_list(),
            "position": self.center.to_list(),
            "color": self.color,
            "text": self.type,
            "isIn": self.isIn
        }

    def get_box(self):
        initial = f'"id": {str(self.id)}, "order": {str(self.order)}, "size": {str(self.get_size().to_list())},"position": {str(self.center.to_list())}, "color": "{self.color}","text": "{self.type}","isIn": "{str(self.isIn)}"'
        return '{' + initial + '}'

'''

def init_box(box):
    box_size = box['width'] * box['height'] * box['length']
    return {
        **box,
        'volume': box_size,
        'rotation': Rotation.WHL,
        'center': {
            'x': 0,
            'y': 0,
            'z': 0,
        },
        'FLB': {
            'x': 0,
            'y': 0,
            'z': 0,
        },
    }

def get_size(box):
    box_rotation = box['rotation']
    if box_rotation == Rotation.WHL:
        return {
            'width': box['width'],
            'height': box['height'],
            'length': box['length'],
        }
    elif box_rotation == Rotation.LHW:
        return {
            'width': box['length'],
            'height': box['height'],
            'length': box['width'],
        }
    elif box_rotation == Rotation.HLW:
        return {
            'width': box['height'],
            'height': box['length'],
            'length': box['width'],
        }
    elif box_rotation == Rotation.LWH:
        return {
            'width': box['length'],
            'height': box['width'],
            'length': box['height'],
        }
    elif box_rotation == Rotation.WLH:
        return {
            'width': box['width'],
            'height': box['length'],
            'length': box['height'],
        }
    elif box_rotation == Rotation.HWL:
        return {
            'width': box['height'],
            'height': box['width'],
            'length': box['length'],
        }

def set_position(box, p):
    # set center, FLB and isIn
    box_size = get_size(box)

    if p[3] == 1:
        box['FLB'] = {
            'x': p[0],
            'y': p[1],
            'z': p[2],
        }
    else:
        box['FLB'] = {
            'x': p[0] - box_size['width'],
            'y': p[1],
            'z': p[2],
        }

    box['center'] = {
        'x': box['FLB']['x'] + box_size['width'] / 2,
        'y': box['FLB']['y'] + box_size['height'] / 2,
        'z': box['FLB']['z'] + box_size['length'] / 2,
    }
    box['isIn'] = 1

def unset_position(box):
    box['FLB'] = {
        'x': 0,
        'y': 0,
        'z': 0,
    }

    box['center'] = {
        'x': 0,
        'y': 0,
        'z': 0,
    }
    box['isIn'] = 0

# Returns the box with the correct size.
# def get_box(box):
#     return {
#         **box,
#         'size': list(get_size(box).values()),
#         'position': list(box['center'].values()),
#         'text': box['type'],
#     }

def get_box_object(box):
    return {
        "id": box["id"],
        "order": box["order"],
        "size": list(get_size(box).values()),
        "position": list(box["center"].values()),
        "color": box["color"],
        "text": box["type"],
        "isIn":box["isIn"]
    }


def get_box(box):
    initial = f'"id": {box["id"].__str__()}, "order": {box["order"].__str__()}, "size": {list(get_size(box).values()).__str__()},"position": {list(box["center"].values()).__str__()}, "color": \"{box["color"]}\","text": \"{box["type"]}\","isIn": \"{box["isIn"].__str__()}\"'
    return '{' + initial + '}'

'''