package com.explore.java;

import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class JumbleStringTest {
    @Test
    @DisplayName("Test empty string given n=0")
    public  void string_len_0(){
        Assertions.assertEquals("", JumbleString.jumbleString("",0));
    }
    @Test
    @DisplayName("Test empty string given n>0")
    public  void string_len_greaterThan_zero(){
        Assertions.assertEquals("", JumbleString.jumbleString("",10000));
    }
    @Test
    @DisplayName("Test  string given n=0")
    public  void n_0(){
        Assertions.assertEquals("Lunga Tsewu", JumbleString.jumbleString("Lunga Tsewu",0));
    }
    @Test
    @DisplayName("Test  string given n=1")
    public  void n_1(){
        Assertions.assertEquals("LnaTeuug sw", JumbleString.jumbleString("Lunga Tsewu",1));
    }
    @Test
    @DisplayName("Test  string given n>1")
    public  void n_2(){
        Assertions.assertEquals("LnaTeuug swLnaTeuug sw", JumbleString.jumbleString("Lunga Tsewu",2));
    }
    /**
     * Test different inputs with different n values
     * Build an out depending on the given n value by
     * Key on Concatenating expected out n times
     * Assert to equals to output of the jumbleString method
     *
     */
    @ParameterizedTest
    @MethodSource("getExampleAnswer")
    @DisplayName("Test  different string given n")
    public  void  differentString(String input, String expectedOutput,long n){
        expectedOutput= generateExpectedOutPut(input, expectedOutput,n);

        if(input==null)  Assertions.assertEquals(expectedOutput,Assertions.assertThrows(NullPointerException.class, ()->
                JumbleString.jumbleString(null,n)
        ).getMessage());

        else Assertions.assertEquals(expectedOutput, JumbleString.jumbleString(input,n));

    }

    /**
     * Generate the expected output for given n value
     * @param input is the input string
     * @param expectedOutPut is the expected output for n=1
     * @param n is number of iteration output must be concatenated
     * @return concatenated output string
     */
    private  String generateExpectedOutPut(String input, String expectedOutPut, long n){
        if(input==null)return expectedOutPut;
        if(n==0) return  input;
        StringBuilder newExpectedOutPut  = new StringBuilder();
        for(int index=0; index<n;index++) {newExpectedOutPut.append(expectedOutPut);}
        return newExpectedOutPut.toString();
    }
    /**
     * We Can use this method  to enter more tests with different string and n>=1
     * @return stream of argument string input, string output and long type n value
     */
    public Stream<Arguments> getExampleAnswer(){
        return Stream.of(
                Arguments.of(null, "Can not concatenate null string",500),
                Arguments.of("He went home", "He went home",0),
                Arguments.of("He went home", "H ethmewn oe",1000),
                Arguments.of("I love java!", "Ilv aa oejv!",100000),
                Arguments.of("Lets code", "Lt oeescd",1000000)
        );

    }




}