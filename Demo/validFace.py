import cv2, dlib, math
from imutils import face_utils
import numpy as np
import base64
import sys

def check_frontal_horizontal(gray):  
    rects = detector(gray, 0)  # 얼굴 개수

    # number of faces on the frame
    if len(rects) > 0:
        # loop over the face detections
        for rect in rects:
            (bX, bY, bW, bH) = face_utils.rect_to_bb(rect)

            shape = predictor(gray, rect)
            shape_np = face_utils.shape_to_np(shape)

            num_of_points_out = 17  # 17번까지 얼굴 하관 라인
            num_of_points_in = shape.num_parts - num_of_points_out
            gx_out = 0;
            gy_out = 0;
            gx_in = 0;
            gy_in = 0

            for i in range(shape.num_parts):  # 총 68개
                shape_point = shape.part(i)
                if i < num_of_points_out:  # 얼굴 라인
                    gx_out = gx_out + shape_point.x / num_of_points_out
                    gy_out = gy_out + shape_point.y / num_of_points_out

                else:  # 얼굴 기관
                    gx_in = gx_in + shape_point.x / num_of_points_in
                    gy_in = gy_in + shape_point.y / num_of_points_in

            # 얼굴 방향 계산
            theta = math.asin(2 * (gx_in - gx_out) / (rect.right() - rect.left()))
            radian = theta * 180 / math.pi
            threshold = 1.5
            if radian < threshold and radian > -threshold:
                return 1
            else:
                return 0

def check_frontal_vertical(gray):  
    rects = detector(gray, 0)  # 얼굴 개수

    # number of faces on the frame
    if len(rects) > 0:
        # loop over the face detections
        for rect in rects:
            (bX, bY, bW, bH) = face_utils.rect_to_bb(rect)

            shape = predictor(gray, rect)
            shape_np = face_utils.shape_to_np(shape)

            num_of_points_out = 17  # 17번까지 얼굴 하관 라인
            num_of_points_in = shape.num_parts - num_of_points_out
            gx_out = 0;
            gy_out = 0;
            gx_in = 0;
            gy_in = 0

            for i in range(shape.num_parts):  # 총 68개
                shape_point = shape.part(i)
                if i < num_of_points_out:  # 얼굴 라인
                    gx_out = gx_out + shape_point.x / num_of_points_out
                    gy_out = gy_out + shape_point.y / num_of_points_out

                else:  # 얼굴 기관
                    gx_in = gx_in + shape_point.x / num_of_points_in
                    gy_in = gy_in + shape_point.y / num_of_points_in

            # 얼굴 방향 계산
            theta = math.asin(2 * (gx_in - gx_out) / (rect.top() - rect.bottom()))
            radian = theta * 180 / math.pi
            threshold = 1.5
            if radian < threshold and radian > 0:
                return 1
            else:
                return 0

def check_frontal(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    horizontal = check_frontal_horizontal(gray)
    vertical = check_frontal_vertical(gray)
    result=horizontal and vertical
    return result

def check_bright(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    rects = detector(gray, 0)  # 얼굴 개수
    # number of faces on the frame
    if len(rects) > 0:
        # loop over the face detections
        for rect in rects:
            (bX, bY, bW, bH) = face_utils.rect_to_bb(rect)
            ROI_img=gray[bY:bY+bH, bX:bX+bW]
            bright=cv2.mean(ROI_img)[0]
            if (bright>120 and bright<200):
                return 1
            else:
                return 0
    
def check_expression(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    rects = detector(gray, 0)  # 얼굴 개수
    # number of faces on the frame
    if len(rects) > 0:
        # loop over the face detections
        for rect in rects:
            (bX, bY, bW, bH) = face_utils.rect_to_bb(rect)
            ROI_img=gray[bY:bY+bH, bX:bX+bW]
            bright=cv2.mean(ROI_img)[0]
            if (bright>120 and bright<200):
                return 1
            else:
                return 0
    

predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
detector = dlib.get_frontal_face_detector()

#REAL CODE
img_data = base64.b64decode(sys.argv[1])
nparr = np.frombuffer(img_data, np.uint8)
image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

# image = cv2.imread(sys.argv[1]) #TEST CODE

if image is None:
    print('Image is Empty!')
    exit()

print("image 생성완료")
result=check_frontal(image), check_bright(image), check_expression(image)

print(result)
