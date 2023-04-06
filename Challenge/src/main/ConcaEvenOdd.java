public class ConcaEvenOdd {

    public  static string jumbleString(String s, long n){
        if(s.length()==0)return s;
        String newString ="";

         String evenString ="", oddString ="";
         for(var i=0; i<s.length(); i++){
             if(i%2==0)evenString+=s.charAt[i]
              else oddString+=s.charAt[i]
         }
         while(n>0){
             newString+=evenString+oddString;
             n--;
         }
         return newString;
    }
    public  static  void  main(String[]args){
        assert "LnaugLnug".equals(jumbleString("Lunga",2);)
    }

}
