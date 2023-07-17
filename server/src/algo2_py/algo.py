from container import get_score, update_pps
from box_motion import rotation, perturbation
from metrics import order_metric, overall_metric
from box import Box
import copy
import sys
import json


def get_best_point(pp, box, container, solutionBoxes):
    bestPoint = None
    bestScore = [0, 0]
    
    for p in pp:
        score = get_score(box, p, solutionBoxes, container)
        if score[0] > bestScore[0] or (score[0] == bestScore[0] and score[1] > bestScore[1]):
            bestPoint = p
            bestScore = score
    
    return bestPoint


def add_box_to_solution(bestPoint, box, pp, solutionBoxes, solution_data, retryList, container, isRetry):
    if bestPoint:
        box.set_position(bestPoint)
        pp = update_pps(box, bestPoint, pp, container)
        solutionBoxes.append(box)
        solution_data["number_of_items"] += 1
        solution_data["capacity"] += box.volume
    else:
        if not isRetry:
            retryList.append(box)
        else:
            solutionBoxes.append(box)

def handle_box(box, pp, container, solutionBoxes, solution_data, retryList, isRetry):
    bestPoint = get_best_point(pp, box, container, solutionBoxes)
    add_box_to_solution(bestPoint, box, pp, solutionBoxes, solution_data, retryList, container, isRetry)


def constructive_packing(boxes, container, isQuantity):
    pp = {
        (0, 0, 0, 1),
        (container["width"], 0, 0, -1)
    }
    
    solutionBoxes = []
    retryList = []
    
    solution_data = {
        "number_of_items": 0,
        "capacity": 0,
        "order_score": 0,
        "overall_score": 0
    }
    
    for box in boxes:
        handle_box(box, pp, container, solutionBoxes, solution_data, retryList, False)
    
    for box in retryList:
        handle_box(box, pp, container, solutionBoxes, solution_data, retryList, True)
    
    solution_data["order_score"] = float(order_metric(solutionBoxes, container))
    solution_data["overall_score"] = float(overall_metric(boxes, container, solution_data, isQuantity))
    
    return [solutionBoxes, solution_data]

def handle_data(data):
    isQuality = int(data['project_data']['isQuality'])
    numOfIterations = 2000 if isQuality else 1000
    isQuantity = int(data['project_data']['isQuantity'])
    container = data['container']
    boxes = data['boxes']

    initBoxes = [Box(box) for box in boxes]
    initBoxes.sort(key=lambda b: b.order, reverse=True)

    return initBoxes, container, numOfIterations, isQuantity

def get_solutions(numOfIterations, boxes, container, isQuantity):
    solutionList = {}
    counter = 0
    for _ in range(numOfIterations):
        #TODO: copy or deepcopy?
        boxesCopy = copy.deepcopy(boxes)
        rotation(boxesCopy)
        perturbation(boxesCopy)
        solution = constructive_packing(boxesCopy, container, isQuantity)
        if solution is None:
            continue
        boxesInSolution, solution_data = solution
        if boxesInSolution is not None and solution_data is not None:
            ## currentBoxes = [box.get_box() for box in boxesInSolution]
            counterString = str(counter)
            solutionList[counterString] = {
                "name": "solution " + counterString,
                "id": counter,
                "boxes": boxesInSolution, ##currentBoxes,
                "solution_data": solution_data
            }
            counter += 1
    return solutionList


def sort_by_preference(solutionList, isQuantity):
    if isQuantity:
        solutionList = sorted(solutionList.values(),
                              key=lambda x: (x["solution_data"]["number_of_items"], x["solution_data"]["capacity"], -x["solution_data"]["order_score"]),
                              reverse=True)[:50]
        solutionList = sorted(solutionList,
                              key=lambda x: (x["solution_data"]["capacity"]),
                              reverse=True)[:25]
        solutionList = sorted(solutionList,
                              key=lambda x: (x["solution_data"]["order_score"]),
                              reverse=False)[:10]
    else:
        solutionList = sorted(solutionList.values(),
                              key=lambda x: (x["solution_data"]["order_score"]),
                              reverse=False)[:20]
        solutionList = sorted(solutionList,
                              key=lambda x: (x["solution_data"]["number_of_items"], x["solution_data"]["capacity"]),
                              reverse=True)[:15]
        solutionList = sorted(solutionList,
                              key=lambda x: (x["solution_data"]["capacity"]),
                              reverse=True)[:10]
    solutionList = sorted(solutionList,
                          key=lambda x: (x["solution_data"]["overall_score"]),
                          reverse=True)
    return solutionList


def dict_solutions_from_list(solutionList):
    solutionDict = {}
    for index, solution in enumerate(solutionList):
        indexString = str(index)
        solutionDict[indexString] = solution
    return solutionDict


def algo():
    data = json.loads(sys.argv[1])

    boxes, container, numOfIterations, isQuantity = handle_data(data)
  
    solutionList = get_solutions(numOfIterations, boxes, container, isQuantity)
    solutionList = sort_by_preference(solutionList, isQuantity)
    solutionDict = dict_solutions_from_list(solutionList)

    return solutionDict

print(algo())
