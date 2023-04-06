package com.explore.java;

/**
 * @author : Lunga Tsewu
 */
public class JumbleString {
    /**
     * Concatenate   chars at even index to front and chars at odd index to back from given string , n times
     * @param s is the input string
     * @param n number of iteration to concatenate string
     * @return concatenate string output
     * @throws  NullPointerException  if string input is null
     */
    public  static String jumbleString(String s, long n){
        if(s==null) throw  new NullPointerException("Can not concatenate null string");

        if(s.length()==0 || n==0)return s;

        StringBuilder newString = new StringBuilder();

        StringBuilder evenString = new StringBuilder();
        StringBuilder oddString = new StringBuilder();

        for(int i = 0; i<s.length(); i++){
            if(i%2==0) evenString.append(s.charAt(i));
            else oddString.append(s.charAt(i));
        }

        while(n>0){
            newString.append(evenString).append(oddString);
            n--;
        }
        return newString.toString();
    }


}

