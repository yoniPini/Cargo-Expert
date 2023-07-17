from enum import IntEnum
import random


class Rotation(IntEnum):
    WHL = 0
    LHW = 1
    HLW = 2
    LWH = 3
    WLH = 4
    HWL = 5


def rotate_each_box(boxes):
    for b in boxes:
        b.rotation = random.choice(list(Rotation))


def rotate_subset(boxes):
    """
    For each subset of items sharing all dimensions,
    randomly pick one of the orientations that with equal probability.
    """

    same_size_dict = {}
    for b in boxes:
        box_size = b.get_size()
        if box_size in same_size_dict.keys():
            same_size_dict[box_size].append(b)
        else:
            same_size_dict[box_size] = [b]

    for k in same_size_dict.keys():
        rotation = random.choice(list(Rotation))
        for b in same_size_dict[k]:
            b.rotation = rotation


def rotation(boxes):
    # Rotate boxes individually or by subset with equal probability
    if boxes:
        chosen_rotation = random.choice([rotate_each_box, rotate_subset])
        chosen_rotation(boxes)




def volume_perturb(b1, b2):
    if 0.7 <= (b1.volume/b2.volume) <= 1.3 and random.randint(0, 1) > 0.5:
        return True
    return False


def perturbation(boxes):
    if len(boxes) <= 1:
        return boxes

    options = [volume_perturb]
    chosen_perturb = random.choice(options)
    for i, b1 in enumerate(boxes[:-1]):
        if chosen_perturb(b1, boxes[i+1]):
            boxes[i], boxes[i+1] = boxes[i+1], boxes[i]
