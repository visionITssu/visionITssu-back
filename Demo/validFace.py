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
            threshold = 1.3
            if radian < threshold and radian > -threshold:
                return 1
            else:
                return 0
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
            if radian < threshold and radian > -threshold:
                return 1
            else:
                return 0
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
            if (bright>70):
                return 1
            else:
                return 0
    else:
        return 0     
def check_mouth(shape):
            #입을 다물어야 함
            lip_t=62
            lip_b=66
            point_lip_t=shape.part(lip_t)
            point_lip_b=shape.part(lip_b)
            mouth=abs(point_lip_t.y-point_lip_b.y)
            threshold = 20
            if mouth < threshold:
                return 1
            else:
                return 0
            
def check_eyebrow(shape):
            #눈썹을 올리지 말아야 함
            eyebrow_l_3=19
            eyebrow_r_3=24
            eye_l_t_1=37
            eye_r_t_1=43
            point_eyebrow_l=shape.part(eyebrow_l_3)
            point_eyebrow_r=shape.part(eyebrow_r_3)
            point_eye_l_t=shape.part(eye_l_t_1)
            point_eye_r_t=shape.part(eye_r_t_1)
            eyebrow_l=abs(point_eyebrow_l.y-point_eye_l_t.y)
            eyebrow_r=abs(point_eyebrow_r.y-point_eye_r_t.y)
            threshold = 30#임시
            if (eyebrow_l < threshold) and (eyebrow_r < threshold):
                return 1
            else:
                return 0

def check_eye(shape):
            #눈을 가늘게 뜨지 않아야 함
            eye_l_t_1=37
            eye_l_t_2=38
            eye_l_b_1=40
            eye_l_b_2=41
            eye_r_t_1=43
            eye_r_t_2=44
            eye_r_b_1=46
            eye_r_b_2=47
            point_eye_l_t_1=shape.part(eye_l_t_1)
            point_eye_l_t_2=shape.part(eye_l_t_2)
            point_eye_r_t_1=shape.part(eye_r_t_1)
            point_eye_r_t_2=shape.part(eye_r_t_2)
            point_eye_l_t=(point_eye_l_t_1.y + point_eye_l_t_2.y)/2
            point_eye_r_t=(point_eye_r_t_1.y + point_eye_r_t_2.y)/2
            point_eye_l_b_1=shape.part(eye_l_b_1)
            point_eye_l_b_2=shape.part(eye_l_b_2)
            point_eye_r_b_1=shape.part(eye_r_b_1)
            point_eye_r_b_2=shape.part(eye_r_b_2)
            point_eye_l_b=(point_eye_l_b_1.y + point_eye_l_b_2.y)/2
            point_eye_r_b=(point_eye_r_b_1.y + point_eye_r_b_2.y)/2
            eye_l=abs(point_eye_l_t - point_eye_l_b)
            eye_r=abs(point_eye_r_t - point_eye_r_b)
            threshold=1
            if ((eye_l > threshold) and (eye_r > threshold)):
                return 1
            else:
                return 0

def check_smile(shape):
            lip_l=48
            lip_r=54
            point_lip_l=shape.part(lip_l)
            point_lip_r=shape.part(lip_r)
            smile=abs(point_lip_r.x-point_lip_l.x)
            threshold = 100
            if (smile < threshold):
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
            shape = predictor(gray, rect)
            if check_smile(shape) and check_mouth(shape) and check_eyebrow(shape) and check_eye(shape):
                return 1
            else:
                return 0
            # return (check_mouth(shape), check_eyebrow(shape), check_eye(shape), check_smile(shape))
    else:
        return 0


predictor = dlib.shape_predictor("/Users/stanhong/school/visionITssu-back/Demo/shape_predictor_68_face_landmarks.dat")
detector = dlib.get_frontal_face_detector()
file_path = sys.argv[1]
#REAL CODE
with open(file_path, 'r') as file:
    base64_data = file.read()

    img_data = base64.b64decode(base64_data)
    nparr = np.frombuffer(img_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

# cap=cv2.VideoCapture(0)
# while cv2.waitKey(33):
#     ret, frame=cap.read()
    
#     if frame is None:
#         print('Image is Empty!')
#         exit()

#     result=check_frontal(frame), check_expression(frame), check_bright(frame) 
#     print(result)
#     cv2.imshow('frame',frame)
# cap.release()
# cv2.DestroyAllWindows()

if image is None:
    print('Image is Empty!')
    exit()

result=check_frontal(image), check_expression(image), check_bright(image)
print(result)