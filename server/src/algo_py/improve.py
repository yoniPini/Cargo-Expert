import copy
import sys
import json
from util import order_metric, overall_metric, rotation, perturbation
from box import Box
from container import Container

NUMBER_OF_ITERATIONS = 1000


def improve_packing(in_boxes: list[Box], out_boxes: list[Box], container: Container) -> list[Box]:

    # We are receiving a list boxes with isIn bit on or off.
    # We need to treat boxes with isIn bit on as constants.
    # We need to find pps from this boxes.
    # After having those pps, we need to run the algorithm with those pps and the rest of the boxes.

    # Updating pps by every box

    pp = set([(0, 0, 0, 1), (container.size[0] - 1, 0, 0, -1)])

    retry_list = []
    solution_boxes = []
    solution_data = {"number_of_items": 0, "capacity": 0,
                     "order_score": 0, "overall_score": 0}

    # Finding pps from in_boxes.
    for box in in_boxes:
        # Placing the box in it right position
        p_left = (int(box.FLB[0]), int(box.FLB[1]), int(box.FLB[2]), 1)
        container.place(box, p_left)
        p_right = (box.FLB[0], box.FLB[1], box.FLB[2], -1)
        # Updating all possible pps from this box
        pp.add(p_left)
        container.update(box, p_left, pp)
        pp.add(p_right)
        container.update(box, p_right, pp)
        solution_boxes.append(box)
        solution_data['number_of_items'] += 1
        solution_data['capacity'] += box.volume

    # Adding each boxes in out_boxes to the container
    for box in out_boxes:
        best_point = None
        best_score = (0, 0)
        # to find the best point we need to know what corner of the box is placed there
        for p in pp:
            score = container.get_score(box, p)
            if score > best_score:
                best_point = p
                best_score = score
        if best_point:
            container.place(box, best_point)
            container.update(box, best_point, pp)
            solution_boxes.append(box)
            solution_data['number_of_items'] += 1
            solution_data['capacity'] += box.volume
        else:
            retry_list.append(box)

    for box in retry_list:
        best_point = None
        best_score = (0, 0)
        for p in pp:
            score = container.get_score(box, p)
            if score > best_score:
                best_point = p
                best_score = score
        if best_point:
            container.place(box, best_point)
            container.update(box, best_point, pp)
            solution_boxes.append(box)
            solution_data['number_of_items'] += 1
            solution_data['capacity'] += box.volume
        else:
            # Adding it to the list without adding it to the container
            solution_boxes.append(box)

    boxes = in_boxes + out_boxes
    solution_data['order_score'] = order_metric(
        solution_boxes, boxes, container)
    solution_data['overall_score'] = overall_metric(
        boxes, container, solution_data, 1)
    return solution_boxes, solution_data


def improve():

    # every key in json is a string in python dict.
    obj = json.loads(sys.argv[1])

    

    container = Container(obj['container']['width'],
                          obj['container']['height'],
                          obj['container']['length'])

    boxes = []

   

    for b in obj['boxes']:
        boxes.append(Box(b['id'], b['order'], b['text'], b['size'][0],
                         b['size'][1], b['size'][2], color=b['color'], isIn=b['isIn'], center=b['position']))

     # Splitting to two lists
    in_boxes, out_boxes = [box for box in boxes if box.isIn == 1], [
        box for box in boxes if box.isIn == 0]
    # Sort isIn's by y coordinate and z coordinate
    in_boxes = sorted(in_boxes, key=lambda box: (box.FLB[1], box.FLB[2]))

    solution_list = {}
    counter = 0

    


    for _ in range(NUMBER_OF_ITERATIONS):
        copy_in_boxes = copy.deepcopy(in_boxes)
        copy_out_boxes = copy.deepcopy(out_boxes)
        container.start_packing()

        # For non-deterministic algorithm
        rotation(copy_out_boxes)
        perturbation(copy_out_boxes)

        temp = improve_packing(copy_in_boxes, copy_out_boxes, container)
        if temp is None:
            continue

        boxes_in_solution, solution_data = temp
        if boxes_in_solution is not None and solution_data is not None:
            counter_string = f'{counter}'
            solution_list[counter_string] = {
                "name": "solution " + counter_string, "id": counter, "boxes": boxes_in_solution, "solution_data": solution_data}
            counter += 1

    solution_list = sorted(solution_list.values(
    ), key=lambda x: x["solution_data"]["overall_score"], reverse=True)[0]

    return solution_list


print(improve())
