global total
total=0
global total_ev
global total_od
total_od=total_ev=""
def encrypt(x:str):
    global total_ev, total_od, total
    x_len =len(x)
    if(total==x_len):
        return total_ev+total_od
    elif (total%2==0):
        total_ev+=x[total]
    else:
        total_od+=x[total]
    total+=1
    return  encrypt(x)
