import copy
import sys
import json
from util import order_metric, overall_metric, rotation, perturbation
from box import Box
from container import Container


def constructive_packing(boxes: list[Box], container: Container, is_quantity: int) -> list[Box]:
    # each point has x,y,z values. In addition, it holds the direction it came from - 1 for left and -1 for right.
    pp = set([(0, 0, 0, 1), (container.size[0] - 1, 0, 0, -1)])
    retry_list = []
    solution_boxes = []
    solution_data = {"number_of_items": 0, "capacity": 0,
                     "order_score": 0, "overall_score": 0}

    for b in boxes:
        best_point = None
        best_score = (0, 0)
        for p in pp:
            score = container.get_score(b, p)
            if score > best_score:
                best_point = p
                best_score = score
        if best_point:
            container.place(b, best_point)
            container.update(b, best_point, pp)
            solution_boxes.append(b)
            solution_data['number_of_items'] += 1
            solution_data['capacity'] += b.volume
        else:
            retry_list.append(b)

    for b in retry_list:
        best_point = None
        best_score = (0, 0)
        for p in pp:
            score = container.get_score(b, p)
            if score > best_score:
                best_point = p
                best_score = score
        if best_point:
            container.place(b, best_point)
            container.update(b, best_point, pp)
            solution_boxes.append(b)
            solution_data['number_of_items'] += 1
            solution_data['capacity'] += b.volume
        else:
            # Adding it to the list without adding it to the container
            solution_boxes.append(b)

    solution_data['order_score'] = order_metric(
        solution_boxes, boxes, container)
    solution_data['overall_score'] = overall_metric(
        boxes, container, solution_data, is_quantity)
    return solution_boxes, solution_data


def handle_data(data):
    is_quality = int(data['project_data']['isQuality'])
    NUMBER_OF_ITERATIONS = 2000 if is_quality else 1000
    is_quantity = int(data['project_data']['isQuantity'])

    container = Container(data['container']['width'],
                          data['container']['height'],
                          data['container']['length'])

    boxes = []
    for b in data['boxes']:
        boxes.append(Box(b['id'], b['order'], b['type'], b['width'],
                         b['height'], b['length'], b['color'], b['isIn']))

    boxes = sorted(boxes, key=lambda x: x.order, reverse=True)
    return (boxes, container, NUMBER_OF_ITERATIONS, is_quantity)


def get_solutions(NUMBER_OF_ITERATIONS: int, boxes: list[Box], container: Container, is_quantity: bool):
    solution_list = {}
    counter = 0
    for _ in range(NUMBER_OF_ITERATIONS):
        copy_boxes = copy.deepcopy(boxes)
        container.start_packing()
        rotation(copy_boxes)
        perturbation(copy_boxes)
        boxes_in_solution, solution_data = constructive_packing(
            copy_boxes, container, is_quantity)
        if boxes_in_solution is not None and solution_data is not None:
            counter_string = f'{counter}'
            solution_list[counter_string] = {
                "name": "solution " + counter_string, "id": counter, "boxes": boxes_in_solution, "solution_data": solution_data}
            counter += 1
    return solution_list


def sort_by_preference(solution_list, is_quantity):
    if is_quantity:
        solution_list = sorted(solution_list.values(
        ), key=lambda x: x["solution_data"]["number_of_items"], reverse=True)[0:50]
        solution_list = sorted(
            solution_list, key=lambda x: x["solution_data"]["capacity"], reverse=True)[0:25]
        solution_list = sorted(
            solution_list, key=lambda x: x["solution_data"]["order_score"], reverse=False)[0:10]
    else:
        solution_list = sorted(solution_list.values(
        ), key=lambda x: x["solution_data"]["order_score"], reverse=False)[0:20]
        solution_list = sorted(
            solution_list, key=lambda x: x["solution_data"]["number_of_items"], reverse=True)[0:15]
        solution_list = sorted(
            solution_list, key=lambda x: x["solution_data"]["capacity"], reverse=True)[0:10]
    solution_list = sorted(
        solution_list, key=lambda x: x["solution_data"]["overall_score"], reverse=True)
    return solution_list


def dict_solutions_from_list(solution_list):
    solution_dict = dict()
    for index, val in enumerate(solution_list):
        index_string = f'{index}'
        solution_dict[index_string] = val
    return solution_dict


def algo():
    data = json.loads(sys.argv[1])
    boxes, container, NUMBER_OF_ITERATIONS, is_quantity = handle_data(data)
    solution_list = get_solutions(
        NUMBER_OF_ITERATIONS, boxes, container, is_quantity)
    solution_list = sort_by_preference(solution_list, is_quantity)
    solution_dict = dict_solutions_from_list(solution_list)
    return solution_dict


print(algo())
