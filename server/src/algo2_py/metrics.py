def num_of_items_metric(solution_boxes):
    in_boxes = [box for box in solution_boxes if box.isIn]
    return len(in_boxes)

def volume_metric(solution_boxes):
    in_boxes = [box for box in solution_boxes if box.isIn]
    volume = sum(normalize([box.volume for box in in_boxes]))
    return volume

def order_metric(solution_boxes, container):
    in_boxes = [box for box in solution_boxes if box.isIn]
    order_list = normalize([box.order for box in in_boxes])
    z_list = normalize([container['length'] - box.FLB[2] for box in in_boxes])
    
    score = 0
    for i in range(len(order_list)):
        order = order_list[i]
        z = z_list[i]
        if order < 0.5:
            score += 1000 * abs(order - z)
        else:
            score += 10 * abs(order - z)
    
    return '{:.2f}'.format(score / len(in_boxes))

def normalize(numbers):
    max_number = max(numbers)
    min_number = min(numbers)
    if max_number == min_number:
        return [1 for _ in numbers]
    return [(number - min_number) / (max_number - min_number) for number in numbers]

def overall_metric(project_boxes, container, solution_data, is_quantity):
    container_volume = container['width'] * container['height'] * container['length']
    num_score = solution_data['number_of_items'] / len(project_boxes)
    cap_score = solution_data['capacity'] / container_volume
    ord_score = solution_data['order_score'] / 100
    
    if not is_quantity:
        score = 0.3 * num_score + 0.2 * cap_score + 0.5 * (1 - ord_score)
    else:
        score = 0.5 * num_score + 0.2 * cap_score + 0.3 * (1 - ord_score)
    
    return '{:.2f}'.format(score * 100)
