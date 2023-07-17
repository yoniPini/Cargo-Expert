from box import Box
import numpy as np

class Container:
    def __init__(self, width, height, length):
        # The algorithm works with integers only.
        width, height, length = int(width), int(height), int(length)
        self.size = width, height, length
        self.volume = width * height * length

    def start_packing(self,):
        #TODO: maybe change to dtype into bool to accelrate algo
        self.space = np.zeros(self.size, np.int32)

    def score_FLB(self, b_size: tuple[int, int, int], p: tuple[int, int, int]) -> tuple[tuple[int, int, int], str]:
        '''
        Returns the FLBs point score 
        '''
        # calculate the other corners of the box if its FLB corner is placed in p.
        FRB = p[0] + b_size[0] - 1
        FLT = p[1] + b_size[1] - 1
        RLB = p[2] + b_size[2] - 1

        # Boundries check
        if (FRB >= self.size[0] or
            FLT >= self.size[1] or
            RLB >= self.size[2]):
            return (0, 0)

        # Overlapping (with boxes) check
        if np.any(self.space[p[0]: FRB + 1,
                             p[1]: FLT + 1,
                             p[2]: RLB + 1] > 0):
            return (0, 0)

        # Box base support check
        if p[1] != 0 and np.any(self.space[p[0]: FRB + 1,
                                           p[1]-1,
                                           p[2]: RLB + 1] == 0):
            return (0, 0)

        # Score calculation based on distance between FLB and container.
        score_z = self.size[2] - p[2]
        score_y = self.size[1] - p[1]

        return (score_z, score_y)

    def score_FRB(self, b_size: tuple[int, int, int], p: tuple[int]) -> tuple[int, int, int]:
        FLB = p[0] - b_size[0] + 1
        FRT = p[1] + b_size[1] - 1
        RRB = p[2] + b_size[2] - 1

        if (FLB < 0 or
            FRT >= self.size[1] or
            RRB >= self.size[2]):
            return (0, 0)

        if np.any(self.space[FLB: p[0] + 1,
                             p[1]: FRT + 1,
                             p[2]: RRB + 1] > 0):
            return (0, 0)

        if p[1] != 0 and np.any(self.space[FLB: p[0] + 1,
                                           p[1] - 1,
                                           p[2]: RRB + 1] == 0):
            return (0, 0)

        score_z = self.size[2] - p[2]
        score_y = self.size[1] - p[1]

        return (score_z, score_y)

    def get_score(self, b: Box, p: tuple[int, int, int, int]) -> tuple[int, int]:
        '''
        Return the score of the point based on its direction.
        '''
        b_size = b.get_size()
        # If the point came from the left
        if p[3] == 1:
            return self.score_FLB(b_size, p)
        return self.score_FRB(b_size, p)
    
    def place(self, b: Box, p: tuple[int, int, int, int]):
        '''
        Places the box in the given point.
        '''
        b_size = b.get_size()
        match p[3]:
            case 1:
                self.space[p[0]: p[0] + b_size[0],
                           p[1]: p[1] + b_size[1],
                           p[2]: p[2] + b_size[2]] = 1
                b.set_position((p[0], p[1], p[2]))
            case - 1:
                self.space[p[0] - b_size[0] + 1: p[0] + 1,
                           p[1]: p[1] + b_size[1],
                           p[2]: p[2] + b_size[2]] = 1
                b.set_position((p[0] - b_size[0] + 1, p[1], p[2]))

    def update(self, b: Box, p: tuple[int, int, int, int], pp: set[tuple[int]]):
        """
        update the list of potential points according to
        - The given box
        - The he point where it was placed.
        """

        pp.remove(p)

        b_size = b.get_size()

        # if the top of the box is lower than the top of container then add the box's FLT
        if p[1] + b_size[1] < self.size[1]:
            pp.add((p[0], p[1] + b_size[1], p[2], p[3]))

        if p[3] == 1:
            p1 = (p[0] + b_size[0], p[1], p[2], 1)  # b_FRB
            p2 = (p[0], p[1], p[2] + b_size[2], 1)  # b_RLB
        else:
            p1 = (p[0] - b_size[0], p[1], p[2], -1)  # b_FLB
            p2 = (p[0], p[1], p[2] + b_size[2], -1)  # b_RRB

        # Adding the appropriate pps.
        for corner in [p1, p2]:
            projection = self.get_vertical_projection(corner)
            if projection != None:
                pp.add(projection)

    def get_vertical_projection(self, p: tuple[int, int, int, int]):
        '''
        Returns the vertical projection of a given point.
        '''

        # Boundries check
        if (p[0] < 0 or p[0] >= self.size[0] or
            p[1] < 0 or p[1] >= self.size[1] or
            p[2] < 0 or p[2] >= self.size[2]):
            return None

        # Availability check
        if self.space[p[0], p[1], p[2]] == 1:
            return None

        # If the box is on the floor
        if p[1] == 0:
            return (p[0], p[1], p[2], p[3])

        # Find the first occupied cell below the point
        first_one_index = np.argmax(np.flip(self.space[p[0], 0:p[1], p[2]]))

        return (p[0], p[1] - first_one_index, p[2], p[3])
