import random
from box import Box, Rotation
from container import Container


def rotate_each_box(boxes: list[Box]) -> None:
    '''
    For each box picks one of its feasible orientations with equal probability.
    '''
    for b in boxes:
        b.rotation = random.choice(list(Rotation))


def rotate_subset(boxes: list[Box]) -> None:
    '''
    For each subset of items sharing all dimensions,
    randomly pick one of the orientations that with equal probability.
    '''
    same_size_dict = {}
    for b in boxes:
        if b.size in same_size_dict.keys():
            same_size_dict[b.size].append(b)
        else:
            same_size_dict[b.size] = [b]

    for k in same_size_dict.keys():
        rotation = random.choice(list(Rotation))
        for b in same_size_dict[k]:
            b.rotation = rotation


def rotation(boxes: list[Box]) -> None:
    '''
    Rotate boxes individually or by subset with equal probability
    '''
    if boxes:
        chosen_rotation = random.choice([rotate_each_box, rotate_subset])
        chosen_rotation(boxes)


def volume_perturb(b1: Box, b2: Box):
    '''
    return True if the division gap is less than 0.3 in 50% of cases
    '''
    if 0.7 <= (b1.volume/b2.volume) <= 1.3 and random.randint(0, 1) > 0.5:
        return True
    return False


def perturbation(boxes: list[Box]):
    '''
    perturb the sorted list using one perturbation option randomly
    '''
    if len(boxes) <= 1:
        return boxes

    options = [volume_perturb]
    chosen_perturb = random.choice(options)
    for i, b1 in enumerate(boxes[:-1]):
        if chosen_perturb(b1, boxes[i+1]):
            boxes[i], boxes[i+1] = boxes[i+1], boxes[i]


def num_of_items_metric(solution_boxes: list[Box]):
    in_boxes = [box for box in solution_boxes if box.isIn]
    return len(in_boxes)


def volume_metric(solution_boxes: list[Box]):
    volume = 0
    in_boxes = [box for box in solution_boxes if box.isIn]
    for v in normalize([box.volume for box in in_boxes]):
        volume += v
    return volume


def order_metric(solution_boxes: list[Box], project_boxes: list[Box], container: Container):
    in_boxes = [box for box in solution_boxes if box.isIn]
    order_list = normalize([box.order for box in in_boxes])
    z_list = normalize([container.size[2] - box.FLB[2] for box in in_boxes])

    score = 0
    for order, z in zip(order_list, z_list):
        # TODO: maybe we should multiply by the score by a factor of something?
        if order < 0.5:
            score += 1000 * (abs(order - z))
        else:
            score += 10 * (abs(order - z))
    return round(score / len(in_boxes), 2)


def normalize(numbers):
    max_number = max(numbers)
    min_number = min(numbers)
    # TODO: return 1 or another number?
    if max_number == min_number:
        return [1 for _ in numbers]
    normalized = [(number - min_number) / (max_number - min_number)
                  for number in numbers]
    return normalized


def overall_metric(project_boxes: list[Box], container: Container, solution_data, is_quantity):
    num_score = solution_data["number_of_items"] / len(project_boxes)
    cap_score = solution_data["capacity"] / container.volume
    ord_score = solution_data["order_score"] / 100
    score = 0
    if not is_quantity:
        score = 0.3 * num_score + 0.2 * cap_score + 0.5 * (1 - ord_score)
    else:
        score = 0.5 * num_score + 0.2 * cap_score + 0.3 * (1 - ord_score)

    return round(score * 100, 2)
