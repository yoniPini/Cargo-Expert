from validations import validate_boxes_location

def get_score(box, p, boxes, container):
    box.set_position(p)
    isValid = validate_boxes_location(box, boxes, container)
    box.unset_position()

    if not isValid:
        return [0, 0]

    # Score calculation based on distance between FLB and container.
    scoreZ = container['length'] - p[2]
    scoreY = container['height'] - p[1]

    return [scoreZ, scoreY]

def update_pps(box, p, pp, container):
    pp.remove(p)

    boxSize = box.get_size()

    if boxSize[1] + p[1] < container['height']:
        pp.add((p[0], p[1] + boxSize[1], p[2], p[3]))

    if p[3] == 1:
        if p[0] + boxSize[0] < container["width"]:
            pp.add((p[0] + boxSize[0], p[1], p[2], p[3])) # b_FRB

        if p[2] + boxSize[2] < container["length"]:
            pp.add((p[0], p[1], p[2] + boxSize[2], p[3])) # b_RLB
    else:
        if p[0] - boxSize[0] > 0:
            pp.add((p[0] - boxSize[0], p[1], p[2], p[3])) # b_FLB

        if p[2] + boxSize[2] < container["length"]:
            pp.add((p[0], p[1], p[2] + boxSize[2], p[3])) # b_RRB

